from django.test import TestCase, Client
from .models import Sensor,Room,RoomSensor,Update

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