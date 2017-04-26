from django import forms
from .models import Sensor,RoomSensor,Room,Update

class SensorForm(forms.Form):
    name = forms.CharField(max_length=200)
    dev_eui = forms.CharField(max_length=200)

class RoomForm(forms.Form):
    name = forms.CharField(max_length=200)
    count = forms.IntegerField(min_value=0)

class RoomSensorForm(forms.Form):
    sensor = forms.CharField(max_length=200)
    polarity = forms.ChoiceField(choices=RoomSensor.POLARITY_CHOICES)

    def clean_sensor(self):
        data = self.cleaned_data['sensor']

        try:
            _ = Sensor.objects.get(id=data)
        except:
            raise forms.ValidationError('Sensor does not exist')

        return data