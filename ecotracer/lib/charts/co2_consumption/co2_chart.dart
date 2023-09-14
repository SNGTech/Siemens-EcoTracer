import 'package:ecotracer/charts/co2_consumption/co2_data.dart';
import 'package:ecotracer/constants/colours.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

class CO2LineChart extends StatefulWidget {
  const CO2LineChart({super.key});

  @override
  State<CO2LineChart> createState() => _CO2LineChartState();
}

class _CO2LineChartState extends State<CO2LineChart> {
  CO2LineData data = CO2LineData();
  //data.init();

  @override
  Widget build(BuildContext context) {
    return LineChart(LineChartData(
        minX: 0,
        maxX: 24,
        minY: 0,
        maxY: 6,
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
              FlSpot(2, 2),
              FlSpot(4, 5),
              FlSpot(6, 4),
              FlSpot(8, 3.2),
              FlSpot(10, 4),
              FlSpot(12, 1.9),
              FlSpot(14, 2.5),
              FlSpot(16, 3),
              FlSpot(18, 5),
              FlSpot(20, 6),
              FlSpot(22, 3),
              FlSpot(24, 5.3)
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
