import 'dart:math' as math;

class MonitorInfoModel {
  double? getWaterVolumePercentage({required Map infoData}) {
    return math.max(0, infoData['water_volume'] / infoData['max_water_volume']);
  }

  double? getTeaVolumePercentage({required Map infoData}) {
    return math.max(0, infoData['tea_volume'] / infoData['max_tea_volume']);
  }

  double? getMilkVolumePercentage({required Map infoData}) {
    return math.max(0, infoData['milk_volume'] / infoData['max_milk_volume']);
  }

  double? getBottleCountPercentage({required Map infoData}) {
    return math.max(0, infoData['bottle_count'] / infoData['max_bottle_count']);
  }
}

