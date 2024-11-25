import boto3
import gzip
import time
import os  # 環境変数を取得するためにosモジュールを追加


def lambda_handler(event, context):
    # 環境変数からロググループ名を取得
    log_group_name = os.environ.get("LOG_GROUP_NAME")
    if not log_group_name:
        print("環境変数 LOG_GROUP_NAME が設定されていません。処理を終了します。")
        return  # ここで関数を終了

    s3 = boto3.client("s3")
    logs_client = boto3.client("logs")

    log_stream_name = context.aws_request_id

    # CloudWatch Logsにログストリームを作成
    try:
        logs_client.create_log_group(logGroupName=log_group_name)
    except logs_client.exceptions.ResourceAlreadyExistsException:
        pass

    logs_client.create_log_stream(
        logGroupName=log_group_name, logStreamName=log_stream_name
    )

    # S3イベントからバケット名とオブジェクトキーを取得
    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = event["Records"][0]["s3"]["object"]["key"]

    # オブジェクトを取得
    response = s3.get_object(Bucket=bucket, Key=key)
    content = gzip.decompress(response["Body"].read()).decode("utf-8")

    # ログイベントをCloudWatch Logsに送信
    log_events = []
    timestamp = int(round(time.time() * 1000))

    for line in content.strip().split("\n"):
        log_events.append({"timestamp": timestamp, "message": line})
        timestamp += 1  # タイムスタンプが同一だとエラーになるため

    logs_client.put_log_events(
        logGroupName=log_group_name, logStreamName=log_stream_name, logEvents=log_events
    )
