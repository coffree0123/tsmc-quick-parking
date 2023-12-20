'''Create mock parking records'''
import random
import string
import datetime
import requests

slots = list(range(1, 669))
start_date = datetime.datetime.strptime('2023-12-04', '%Y-%m-%d').astimezone()
end_date = datetime.datetime.strptime('2023-12-05', '%Y-%m-%d').astimezone()

user_licenses = ['ABC-5678', 'DEF-1234', 'GHI-7890', 'JKL-4567',
                 'MNO-8901', 'PQR-2345', 'STU-6789', 'VWX-3456',
                 'YZA-9012', 'BCD-7890', 'EFG-1234', 'HIJ-5678',
                 'KLM-2345', 'NOP-6789', 'QRS-3456', 'TUV-9012',
                 'WXY-4567', 'ZAB-8901', 'CDE-1234', 'FGH-5678']
random.shuffle(user_licenses)

for slot in slots:
    t = start_date
    num_cars = random.randint(2, 4)
    for i in range(num_cars):
        # pylint: disable=invalid-name
        if random.uniform(0, 1) < 0.1 and len(user_licenses) > 0:
            license_plate_no = user_licenses.pop()
        else:
            license_plate_no = ''.join(random.choices(string.ascii_uppercase, k=3)) \
                        + '-' + ''.join(random.choices(string.digits, k=4))
        interval = random.randint(60, 60*180)
        start_time = t + datetime.timedelta(seconds=interval)
        duration = random.randint(60*30, 60*480)
        end_time = start_time + datetime.timedelta(seconds=duration)
        t = end_time
        if end_time > end_date:
            break
        park_response = requests.post(f'http://127.0.0.1:8000/api/parking/{slot}',
                        json={"license_plate_no": license_plate_no, "start_time": str(start_time)},
                        timeout=5)
        if park_response.status_code != 200:
            continue
        pick_response = requests.put(f'http://127.0.0.1:8000/api/parking/{slot}',
                        json={"license_plate_no": license_plate_no, "end_time": str(end_time)},
                        timeout=5)
        if pick_response.status_code!= 200:
            print(f'{license_plate_no} still in slot {slot}, start time: {start_time}')
