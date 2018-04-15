import requests


def main(iot_obj):
    url = ('http://{iot_org_id}.messaging.internetofthings.ibmcloud.com:1883/api/v0002/'
           'device/types/{device_type}/devices/{device_id}/events/query').format(**iot_obj)
    headers = {'Content-Type': 'application/json'}
    auth = ('use-token-auth', iot_obj['api_token'])
    payload = {"d": iot_obj['msg']}
    requests.post(url, headers=headers, json=payload, auth=auth)
    return {"msg": payload}
