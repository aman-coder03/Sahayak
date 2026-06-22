from database.mysql_db import engine
from database.base import Base

import models.fraud_case

Base.metadata.create_all(bind=engine)

print("Tables Created Successfully")