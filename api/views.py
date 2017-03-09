from django.shortcuts import render
from django.http import HttpResponseNotAllowed, JsonResponse
from .models import Sensor,RoomSensor,Room,Update

only_get_allowed = HttpResponseNotAllowed(['GET'])

# Sensor methods

def list_sensors(request):
    if request.method != 'GET':
        return only_get_allowed

    sensors = [s.as_dict() for s in Sensor.objects.all()]

    return JsonResponse(sensors, safe=False)