from django.contrib import admin
from .models import Sensor,RoomSensor,Room,Update

admin.site.register(Sensor)
admin.site.register(Room)
admin.site.register(Update)
admin.site.register(RoomSensor)