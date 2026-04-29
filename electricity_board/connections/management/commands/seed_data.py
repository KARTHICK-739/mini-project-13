import random
from datetime import datetime, timedelta

from django.core.management.base import BaseCommand


from connections.models import Connection

class Command(BaseCommand):
    help = "Seed database with dummy connection data"

    def handle(self, *args, **kwargs):

        print("🔥 SEED RUNNING...")

        # ✅ Ensure user exists
       
        # ✅ Clear old data (optional but recommended)
        Connection.objects.all().delete()

        # ✅ Sample data
        names = [
            "Michael", "David", "John", "Jennifer", "Chris",
            "Emma", "Olivia", "Liam", "Noah", "Sophia",
            "Ava", "Isabella", "Mason", "Logan", "Lucas",
            "Karthick", "Arun", "Rahul", "Priya", "Anjali"
        ]

        districts = ["North", "South", "East", "West"]
        ownerships = ["Individual", "Joint"]
        id_types = ["Aadhar", "PAN", "Voter_ID", "Passport"]
        categories = ["Residential", "Commercial"]
        statuses = ["pending", "approved", "rejected"]

        comments_list = [
            "Under review",
            "Approved successfully",
            "Rejected due to invalid documents",
            "Waiting for verification",
            "Documents verified"
        ]

        # ✅ Create 100 records
        for i in range(100):

            application_date = datetime.today() - timedelta(days=random.randint(1, 365))

            Connection.objects.create(
              
                name=random.choice(names),
                gender=random.choice(["Male", "Female"]),
                district=random.choice(districts),
                state="Karnataka",
                pincode=str(random.randint(560000, 560999)),
                ownership=random.choice(ownerships),
                govt_id_type=random.choice(id_types),
                id_number=str(random.randint(100000, 999999)),
                category=random.choice(categories),
                load_applied=random.randint(1, 200),
                date_of_application=application_date,
                reviewer_id=random.randint(1000, 5000),
                reviewer_name="Officer " + str(random.randint(1, 10)),
                reviewer_comments=random.choice(comments_list),
                status=random.choice(statuses),
            )

        self.stdout.write(self.style.SUCCESS("✅ 100 connections created successfully!"))