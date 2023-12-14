'''Create mock parking records'''
import random
import string
import datetime
import requests

slots = list(range(1, 861))
start_date = datetime.datetime.strptime('2023-12-04', '%Y-%m-%d')
end_date = datetime.datetime.strptime('2023-12-05', '%Y-%m-%d')

for slot in slots:
    t = start_date
    num_cars = random.randint(2, 5)
    for i in range(num_cars):
        # pylint: disable=invalid-name
        plate_num = ''.join(random.choices(string.ascii_uppercase, k=3)) \
                    + '-' + ''.join(random.choices(string.digits, k=4))
        interval = random.randint(60, 60*180)
        start_time = t + datetime.timedelta(seconds=interval)
        duration = random.randint(60*30, 60*480)
        end_time = start_time + datetime.timedelta(seconds=duration)
        t = end_time
        if end_time > end_date:
            break
        park_response = requests.post(f'http://127.0.0.1:8000/api/parking/{slot}',
                        json={"license_plate_no": plate_num, "start_time": str(start_time)},
                        timeout=5)
        if park_response.status_code != 200:
            continue
        pick_response = requests.put(f'http://127.0.0.1:8000/api/parking/{slot}',
                        json={"license_plate_no": plate_num, "end_time": str(end_time)},
                        timeout=5)
        if pick_response.status_code!= 200:
            print(f'{plate_num} still in slot {slot}, start time: {start_time}')
