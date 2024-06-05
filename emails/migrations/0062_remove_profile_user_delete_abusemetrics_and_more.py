# Generated by Django 4.2.13 on 2024-06-05 17:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("emails", "0061_relayaddress_idx_ra_created_by_addon"),
        ("privaterelay", "0010_move_profile_and_abusemetrics"),
    ]

    state_operations = [
        migrations.DeleteModel(
            name="AbuseMetrics",
        ),
        migrations.DeleteModel(
            name="Profile",
        ),
    ]
    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=state_operations,
        ),
    ]
