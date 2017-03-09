from django.shortcuts import render
from django.http import HttpResponseBadRequest, JsonResponse
from .models import Sensor,RoomSensor,Room,Update
import json

# Sensor methods

# GET /v1/sensors
def list_sensors(request):
    sensors = [s.as_dict() for s in Sensor.objects.all()]

    return JsonResponse(sensors, safe=False)

# POST /v1/sensors
def add_sensor(request):
    try:
        body = json.loads(request.body.decode('utf-8'))
    except ValueError:
        return HttpResponseBadRequest()

    