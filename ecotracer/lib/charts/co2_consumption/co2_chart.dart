import 'package:ecotracer/charts/co2_consumption/co2_data.dart';
import 'package:ecotracer/constants/colours.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

class CO2LineChart extends StatelessWidget {
  CO2LineChart({super.key});

  CO2LineData data = CO2LineData();

  //data.init();
  @override
  Widget build(BuildContext context) {
    return LineChart(LineChartData(
        minX: 0,
        maxX: 23,
        minY: 0,
        maxY: 40,
        borderData: FlBorderData(
            show: true,
            border: const Border(
                left: BorderSide(width: 1.5, color: AppColor.dark),
                bottom: BorderSide(width: 1.5, color: AppColor.dark))),
        titlesData: FlTitlesData(
            topTitles:
                const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            rightTitles:
                const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            leftTitles: AxisTitles(sideTitles: data.getTicks()),
            bottomTitles: AxisTitles(sideTitles: data.getTicks())),
        lineBarsData: [
          LineChartBarData(
            spots: [
              // PUT INTO DATA CLASS
              FlSpot(0, 3),
              FlSpot(2, 5),
              FlSpot(4, 13),
              FlSpot(6, 26),
              FlSpot(8, 34),
              FlSpot(10, 39),
              FlSpot(12, 35),
              FlSpot(14, 32),
              FlSpot(16, 29.98),
            ],
            barWidth: 3,
            color: AppColor.darkTeal,
            dotData: FlDotData(
                show: true,
                getDotPainter: (p0, p1, p2, p3) {
                  return FlDotCirclePainter(
                      color: AppColor.btnBg, strokeWidth: 0, radius: 4);
                }),
          )
        ]));
  }
}
