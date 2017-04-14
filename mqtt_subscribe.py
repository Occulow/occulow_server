import paho.mqtt.client as mqtt
import os, sys, ssl, json, base64, logging, time
# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'occulow_server.settings')
import django
django.setup()
from api.models import Sensor,Update

if sys.platform == 'win32':
    CERT_PATH = '.'
    PASS_PATH = 'mqtt_pass.txt'
    LOGGING_FNAME = 'occulow_mqtt.log'
else:
    CERT_PATH = '/etc/ssl/certs/'
    PASS_PATH = '/etc/mqtt_pass.txt'
    LOGGING_FNAME = os.path.expanduser('~/logs/occulow_mqtt_%s.log' % time.strftime("%Y%m%d-%H%M%S"))


USERNAME='team21'
with open(PASS_PATH, 'r') as f:
    PASSWORD=f.read().strip()
HOST='openchirp.andrew.cmu.edu'
PORT=1883
KEEPALIVE=60

#TEST_PAYLOAD = '{"devEUI":"1122334455667799","time":"2017-03-17T16:46:24.624994Z","fPort":1,"gatewayCount":2,"rssi":-47,"data":"DQ=="}'

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, rc):
    logging.info('Connected with result code '+str(rc))
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    #client.subscribe('application/0000000000000100/node/#')
    client.subscribe('application/0000000000000100/+/+/rx')
    #client.subscribe('gateway/#')

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    logging.info(str(msg.topic.encode('utf-8')))
    process_payload(bytes.decode(msg.payload))
    

def process_payload(payload):
    json_payload = json.loads(payload)
    try:
        sensor = Sensor.objects.get(dev_eui=json_payload.get('devEUI'))
    except Sensor.DoesNotExist:
        logging.warning('Error - sensor not found: %s' % json_payload.get('devEUI'))
        return

    data = json_payload.get('data')

    if data:
        try:
            decoded = base64.b64decode(data)
            in_count = int(decoded[0:2], 16)
            out_count = int(decoded[2:4], 16)
        except Exception as e:
            logging.warning('Error - couldn\'t decode payload data: ' + str(e))
            return
    else:
        logging.warning('Error - data not in payload: ' + str(json_payload))
        return
    new_update = Update(in_count=in_count, out_count=out_count,sensor=sensor)
    logging.info(new_update)
    new_update.save()
    

if __name__ == '__main__':
    # Setup logger
    logging.basicConfig(filename=LOGGING_FNAME, level=logging.DEBUG)
    # Setup MQTT client
    client = mqtt.Client()
    client.username_pw_set(USERNAME, PASSWORD)

    client.tls_set(os.path.join(CERT_PATH, 'ca-certificates.crt'), 
        cert_reqs=ssl.CERT_REQUIRED, 
        tls_version=ssl.PROTOCOL_TLSv1_2, 
        ciphers=None)

    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(HOST, PORT, KEEPALIVE)

    client.loop_forever()