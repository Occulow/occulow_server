from django.shortcuts import render
from django.http import HttpResponseNotAllowed
from . import models

only_get_allowed = HttpResponseNotAllowed(['GET'])

# Sensor methods

def list_sensors(request):
    if request.method != 'GET':
        return only_get_allowed

    