import random
import string
import requests
import datetime


slots = list(range(1, 861))
for slot in slots:
    t = datetime.datetime(2023, 12, 3, 0, 0, 0)
    num_cars = random.randint(2, 5)
    for i in range(num_cars):
        plate_num = ''.join(random.choices(string.ascii_uppercase, k=3)) + '-' + ''.join(random.choices(string.digits, k=4))
        interval = random.randint(60, 60*180)
        t += datetime.timedelta(seconds=interval)
        requests.post(f'http://127.0.0.1:8000/api/parking/{slot}', json={"license_plate_no": plate_num, "start_time": str(t)})
        duration = random.randint(60*30, 60*480)
        t += datetime.timedelta(seconds=duration)
        requests.put(f'http://127.0.0.1:8000/api/parking/{slot}', json={"end_time": str(t)})