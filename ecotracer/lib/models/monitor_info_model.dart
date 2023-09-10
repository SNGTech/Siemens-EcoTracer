import 'dart:math' as math;

class MonitorInfoModel {
  double? getWaterVolumePercentage({required Map infoData}) {
    return math.max(0, infoData['water_volume'] / infoData['max_water_volume']);
  }
}
