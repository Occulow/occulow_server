from django import forms
from .models import Sensor,RoomSensor,Room,Update

class SensorForm(forms.Form):
    name = forms.CharField(max_length=200)
    dev_eui = forms.CharField(max_length=200)