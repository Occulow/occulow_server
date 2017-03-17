from django.db import models

class Sensor(models.Model):
    name = models.CharField(max_length=200)
    dev_eui = models.CharField(max_length=200)

    def as_dict(self, with_relationships=False):
        data = {
            'type': 'sensor',
            'id': self.id,
            'name': self.name,
            'dev_eui': self.dev_eui,
        }

        if with_relationships:
            data['rooms'] = [r.as_dict() for r in self.roomsensor_set.all()]

        return data

    def __str__(self):
        return self.name

class RoomSensor(models.Model):
    NEGATIVE = -1
    POSITIVE = 1
    POLARITY_CHOICES = [(NEGATIVE,'Negative'), (POSITIVE, 'Positive')]

    sensor = models.ForeignKey("Sensor")
    room = models.ForeignKey("Room")
    polarity = models.IntegerField(choices=POLARITY_CHOICES, default=POSITIVE)

    def as_dict(self):
        data = {
            'type': 'roomsensor',
            'sensor': self.sensor.id,
            'room': self.room.id,
            'polarity': self.polarity
        }

        return data

    def __str__(self):
        return ("%s-%s : %d" % (str(self.sensor), str(self.room), self.polarity))

class Room(models.Model):
    name = models.CharField(max_length=200)
    sensors = models.ManyToManyField(Sensor, through=RoomSensor)
    count = models.PositiveIntegerField()

    def as_dict(self, with_relationships=False):
        data = {
            'type': 'room',
            'id': self.id,
            'name': self.name,
            'count': self.count
        }

        if with_relationships:
            data['sensors'] = [s.as_dict() for s in self.sensors.all()]

        return data

    def __str__(self):
        return self.name 

class Update(models.Model):
    value = models.IntegerField()
    time = models.DateTimeField(auto_now_add=True)
    sensor = models.ForeignKey(Sensor)

    def as_dict(self, with_relationships=False):
        data = {
            'type': 'update',
            'id': self.id,
            'time': str(self.time),
            'value': self.value,
        }

        if with_relationships:
            data['sensor'] = self.sensor.as_dict()

        return data

    def save(self, *args, **kwargs):
        # Update the room counts on save
        room_sensors = RoomSensor.objects.filter(sensor=self.sensor)
        for rs in room_sensors:
            room = rs.room
            room.count += self.value * rs.polarity
            room.save()
        super(Model, self).save(*args, **kwargs)

    def __str__(self):
        return "%s-%s: %d" % (str(self.sensor), str(self.time), self.value)