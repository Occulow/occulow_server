from django.db import models

class Sensor(models.Model):
    name = models.CharField(max_length=200)
    dev_eui = models.CharField(max_length=200)

class RoomSensor(models.Model):
    NEGATIVE = -1
    POSITIVE = 1
    POLARITY_CHOICES = [(NEGATIVE,'Negative'), (POSITIVE, 'Positive')]

    sensor = models.ForeignKey("Sensor")
    room = models.ForeignKey("Room")
    polarity = models.IntegerField(choices=POLARITY_CHOICES, default=POSITIVE)

class Room(models.Model):
    name = models.CharField(max_length=200)
    sensors = models.ManyToManyField(Sensor, through=RoomSensor)
    people = models.PositiveIntegerField()

class Update(models.Model):
    value = models.IntegerField()
    time = models.DateTimeField(auto_now_add=True)
    sensor = models.ForeignKey(Sensor)