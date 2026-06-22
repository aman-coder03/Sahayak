from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    TIMESTAMP
)

from sqlalchemy.sql import func

from database.base import Base


class FraudCase(Base):

    __tablename__ = "fraud_cases"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    phone = Column(String(20))

    upi = Column(String(100))

    transcript = Column(Text)

    dna_id = Column(String(50))

    cluster_id = Column(String(20))

    authority_score = Column(Integer)

    urgency_score = Column(Integer)

    payment_score = Column(Integer)

    confidence_score = Column(Float)

    network_risk = Column(String(20))

    fraud_type = Column(String(50))

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )
    
    city = Column(String(100))

    state = Column(String(100))

    latitude = Column(Float)

    longitude = Column(Float)