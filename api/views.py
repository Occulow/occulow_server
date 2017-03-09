from django.shortcuts import render
from django.http import HttpResponseBadRequest,HttpResponseNotFound,JsonResponse
from .models import Sensor,RoomSensor,Room,Update
from .forms import SensorForm
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

    form = SensorForm(body)

    if form.is_valid():
        s = Sensor(name=form.cleaned_data['name'], dev_eui=form.cleaned_data['dev_eui'])
        s.save()
        return JsonResponse(s.as_dict())
    else:
        return HttpResponseBadRequest()

# GET /v1/sensors/<id>
def get_sensor(request, id):
    try:
        sensor = Sensor.objects.get(id=id)
    except Sensor.DoesNotExist:
        return HttpResponseNotFound()

    return JsonResponse(sensor.as_dict(True))