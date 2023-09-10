import 'package:ecotracer/charts/timing_distribution/td_data.dart';
import 'package:ecotracer/constants/colours.dart';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class TDBarChart extends StatelessWidget {
  final List timingDistribution;

  const TDBarChart({required this.timingDistribution, super.key});

  @override
  Widget build(BuildContext context) {
    TDBarChartData data = TDBarChartData(
        percentWork: timingDistribution[0],
        percentIdle: timingDistribution[1],
        percentDowntime: timingDistribution[2]);
    data.init();

    return BarChart(BarChartData(
        maxY: 105,
        minY: 0,
        borderData: FlBorderData(
            show: true,
            border: const Border(
                bottom: BorderSide(width: 1.5, color: AppColor.dark),
                right: BorderSide(width: 1.5, color: AppColor.dark))),
        titlesData: FlTitlesData(
            topTitles:
                const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            leftTitles:
                const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            bottomTitles: AxisTitles(sideTitles: data.getLabels()),
            rightTitles: AxisTitles(sideTitles: data.getTicks())),
        gridData: FlGridData(
            drawVerticalLine: false,
            checkToShowHorizontalLine: (value) => value % data.interval == 0,
            getDrawingHorizontalLine: (value) {
              return const FlLine(color: Color(0xFFCFCFCF), strokeWidth: 1);
            }),
        barGroups: data.barData
            .map((bar) => BarChartGroupData(x: bar.x, barRods: [
                  BarChartRodData(
                      toY: bar.y,
                      color: bar.colour,
                      borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(5),
                          topRight: Radius.circular(5)),
                      width: 25)
                ]))
            .toList()));
  }
}
