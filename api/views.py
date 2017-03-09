from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseBadRequest,HttpResponseNotFound,JsonResponse
from .models import Sensor,RoomSensor,Room,Update
from .forms import SensorForm
import json

##################
# Sensor methods #
##################

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
    sensor = get_object_or_404(Sensor, id=id)

    return JsonResponse(sensor.as_dict(True))

# GET /v1/sensors/<id>/updates
def get_sensor_updates(request, id):
    sensor = get_object_or_404(Sensor, id=id)

    updates = [u.as_dict() for u in sensor.update_set.all()]

    return JsonResponse(updates, safe=False)

##################
# Room methods #
##################

# GET /v1/rooms
def list_rooms(request):
    rooms = [r.as_dict() for r in Room.objects.all()]

    return JsonResponse(rooms, safe=False)

# POST /v1/rooms
def add_room(request):
    return JsonResponse({})