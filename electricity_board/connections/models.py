from django.db import models
from django.contrib.auth.models import User


class Connection(models.Model):

    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
    ]

    OWNERSHIP_CHOICES = [
        ("Individual", "Individual"),
        ("Joint", "Joint"),
    ]

    ID_TYPE_CHOICES = [
        ("Aadhar", "Aadhar"),
        ("PAN", "PAN"),
        ("Voter_ID", "Voter ID"),
        ("Passport", "Passport"),
    ]

    CATEGORY_CHOICES = [
        ("Residential", "Residential"),
        ("Commercial", "Commercial"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    # 🔐 Linked user (admin/operator)
  

    # 👤 Applicant details
    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    district = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    pincode = models.CharField(max_length=10)

    # 🏠 Ownership
    ownership = models.CharField(max_length=20, choices=OWNERSHIP_CHOICES)

    # 🪪 Govt ID
    govt_id_type = models.CharField(max_length=20, choices=ID_TYPE_CHOICES)
    id_number = models.CharField(max_length=50)

    # ⚡ Connection details
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    load_applied = models.IntegerField()

    # 📅 Dates
    date_of_application = models.DateField()

    # 👨‍💼 Reviewer details
    reviewer_id = models.IntegerField()
    reviewer_name = models.CharField(max_length=10, blank=True, default="")
    reviewer_comments = models.TextField(blank=True, default="")

    # 📊 Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    # 🕒 Auto timestamps (optional but useful)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.category} - {self.status}"