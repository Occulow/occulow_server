# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-10 17:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20170309_1434'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='update',
            name='value',
        ),
        migrations.AddField(
            model_name='update',
            name='count_in',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='update',
            name='count_out',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
