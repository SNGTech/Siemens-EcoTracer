import 'dart:math' as math;

class MonitorInfoModel {
  double? getWaterVolumePercentage({required Map resData}) {
    return math.max(0, resData["volume_data"][0]['current_volume'] / resData["volume_data"][0]['max_volume']);
  }

  double? getTeaVolumePercentage({required Map resData}) {
    return math.max(0, resData["volume_data"][1]['current_volume'] / resData["volume_data"][1]['max_volume']);
  }

  double? getMilkVolumePercentage({required Map resData}) {
    return math.max(0, resData["volume_data"][2]['current_volume'] / resData["volume_data"][2]['max_volume']);
  }

  double? getBottleCountPercentage({required Map resData}) {
    return math.max(0, resData['bottle_count'] / resData['max_bottle_count']);
  }
}

