import requests


def main(iot_obj):
    """This function publishes the results from the Watson Assistant service
       to the Watson IoT platform and subsequently all subscribed devices"""
    # import IOT platform credentials
    auth = ('use-token-auth', iot_obj['api_token'])
    headers = {'Content-Type': 'application/json'}
    # extract result from Watson Assistant
    payload = {'d': iot_obj['msg']}
    # publish Watson Assistant intent/entity pair to Watson IOT platform
    url = ('https{iot_org_id}.messaging.internetofthings.ibmcloud.com:8883/'
           'api/v0002/device/types/{device_type}/devices/{device_id}/events/'
           'query'.format(**iot_obj))
    requests.post(url, headers=headers, json=payload, auth=auth)
    return {'msg': payload}
