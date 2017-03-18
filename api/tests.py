from django.test import TestCase, Client
from .models import Sensor,Room,RoomSensor,Update
import json

class ApiTestCase(TestCase):
    fixtures = ['api.json']

    def setup(self):
        self.client = Client()

class SensorTestCase(ApiTestCase):

    def test_list_sensors(self):
        res = self.client.get('/v1/sensors/')

        self.assertEqual(res.status_code, 200)

        sensors = Sensor.objects.all()
        ret_ids = [r['id'] for r in res.json()]

        self.assertEqual(len(ret_ids), len(sensors))
        for sensor in sensors:
            self.assertIn(sensor.id, ret_ids)

    def test_get_sensor(self):
        sensor = Sensor.objects.all()[0]

        res = self.client.get('/v1/sensors/%d/' % sensor.id)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['name'], sensor.name)

    def test_get_updates_self(self):
        sensor = Sensor.objects.all()[0]

        res = self.client.get('/v1/sensors/%d/updates/' % sensor.id)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json()), len(sensor.update_set.all()))

        ret_ids = [u['id'] for u in res.json()]
        for u in sensor.update_set.all():
            self.assertIn(u.id, ret_ids)

    def test_add_sensor(self):
        new_sensor = {
            'name': 'Foo',
            'dev_eui': 'deadbeefdeadbeef'
        }

        res = self.client.post('/v1/sensors/', json.dumps(new_sensor), content_type='application/json')
        self.assertEqual(res.status_code, 200)

        id = res.json()['id']

        sensor = Sensor.objects.get(id=id)

        self.assertEqual(sensor.name, new_sensor['name'])
        self.assertEqual(sensor.dev_eui, new_sensor['dev_eui'])

class RoomTestCase(ApiTestCase):

    def test_list_rooms(self):
        res = self.client.get('/v1/rooms/')

        self.assertEqual(res.status_code, 200)

        rooms = Room.objects.all()
        ret_ids = [r['id'] for r in res.json()]

        self.assertEqual(len(ret_ids), len(rooms))
        for room in rooms:
            self.assertIn(room.id, ret_ids)

    def test_get_room(self):
        room = Room.objects.all()[0]

        res = self.client.get('/v1/rooms/%d/' % room.id)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['name'], room.name)

    def test_add_room(self):
        new_room = {
            'name': 'Gym',
            'count': 2
        }

        res = self.client.post('/v1/rooms/', json.dumps(new_room), content_type='application/json')
        self.assertEqual(res.status_code, 200)

        id = res.json()['id']

        room = Room.objects.get(id=id)

        self.assertEqual(room.name, new_room['name'])
        self.assertEqual(room.count, new_room['count'])