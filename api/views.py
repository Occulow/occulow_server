from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseBadRequest,HttpResponseNotFound,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Sensor,RoomSensor,Room,Update
from .forms import SensorForm, RoomForm, RoomSensorForm
import json

##################
# Sensor methods #
##################

# GET /v1/sensors/
def list_sensors(request):
    sensors = [s.as_dict() for s in Sensor.objects.all()]

    return JsonResponse(sensors, safe=False)

# POST /v1/sensors/
def add_sensor(request):
    try:
        body = json.loads(request.body.decode('utf-8'))
    except ValueError as e:
        return HttpResponseBadRequest('Bad encoding')

    form = SensorForm(body)

    if form.is_valid():
        s = Sensor(name=form.cleaned_data['name'], dev_eui=form.cleaned_data['dev_eui'])
        s.save()
        return JsonResponse(s.as_dict())
    else:
        print(form.errors())

    return HttpResponseBadRequest(form.errors())

# GET /v1/sensors/<id>/
def get_sensor(request, id):
    sensor = get_object_or_404(Sensor, id=id)

    return JsonResponse(sensor.as_dict(True))

# GET /v1/sensors/<id>/updates/
def get_sensor_updates(request, id):
    sensor = get_object_or_404(Sensor, id=id)

    latest_id = request.GET.get('latest')
    update_query = sensor.update_set.all().order_by('-time')
    try:
        if int(latest_id) > -1:
            update_query = update_query.filter(id__gt=latest_id)
    except TypeError:
        pass
    updates = [u.as_dict() for u in update_query]

    return JsonResponse(updates, safe=False)

##################
# Room methods #
##################

# GET /v1/rooms/
def list_rooms(request):
    rooms = [r.as_dict() for r in Room.objects.all()]

    return JsonResponse(rooms, safe=False)

# POST /v1/rooms/
def add_room(request):
    try:
        body = json.loads(request.body.decode('utf-8'))
    except ValueError:
        return HttpResponseBadRequest()

    form = RoomForm(body)

    if form.is_valid():
        r = Room(name=form.cleaned_data['name'],count=form.cleaned_data['count'])
        r.save()
        return JsonResponse(r.as_dict())

    return HttpResponseBadRequest()

# GET /v1/rooms/<id>/
def get_room(request, id):
    room = get_object_or_404(Room, id=id)

    return JsonResponse(room.as_dict(True))

# GET /v1/rooms/<id>/sensors/
def get_room_sensors(request, id):
    room = get_object_or_404(Room, id=id)

    sensors = [s.as_dict() for s in RoomSensor.objects.filter(room=room)]

    return JsonResponse(sensors, safe=False)

# POST /v1/rooms/<id>/sensors/
def add_room_sensor(request, id):
    room = get_object_or_404(Room, id=id)

    try:
        body = json.loads(request.body.decode('utf-8'))
    except ValueError:
        return HttpResponseBadRequest()

    form = RoomSensorForm(body)

    if form.is_valid():
        # Guaranteed to work because of form validation
        sensor = Sensor.objects.get(id=form.cleaned_data['sensor'])
        rs = RoomSensor(room=room,sensor=sensor,polarity=form.cleaned_data['polarity'])
        rs.save()

        return JsonResponse(rs.as_dict())

    return HttpResponseBadRequest()