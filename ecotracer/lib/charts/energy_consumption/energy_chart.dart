import 'package:ecotracer/charts/energy_consumption/energy_data.dart';
import 'package:ecotracer/constants/colours.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

class EnergyConsumptionChart extends StatelessWidget {
  final List energyConsumptions;

  const EnergyConsumptionChart({required this.energyConsumptions, super.key});

  @override
  Widget build(BuildContext context) {
    EnergyBarData data = EnergyBarData(
        measuring: energyConsumptions[0],
        filtering: energyConsumptions[1],
        brewing: energyConsumptions[2],
        mixing: energyConsumptions[3],
        dispensing: energyConsumptions[4],
        valves: energyConsumptions[5],
        bottling: energyConsumptions[6],
        heating: energyConsumptions[7],
        processing: energyConsumptions[8],
        labelling: energyConsumptions[9]);
    data.init();

    return BarChart(BarChartData(
        maxY: 510,
        minY: 0,
        borderData: FlBorderData(
          show: true,
          border: const Border(
              bottom: BorderSide(width: 1.5, color: AppColor.dark)),
        ),
        gridData: FlGridData(
            drawVerticalLine: false,
            checkToShowHorizontalLine: (value) => value % data.interval == 0,
            getDrawingHorizontalLine: (value) {
              return const FlLine(color: Color(0xFF7F7F7F), strokeWidth: 0.8);
            }),
        titlesData: FlTitlesData(
            topTitles:
                const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            rightTitles:
                const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            leftTitles: AxisTitles(sideTitles: data.getTicks()),
            bottomTitles: AxisTitles(sideTitles: data.getLabels())),
        barGroups: data.barData
            .map((bar) => BarChartGroupData(x: bar.x, barRods: [
                  BarChartRodData(
                      toY: bar.y,
                      rodStackItems: [
                        // Current Consumption
                        BarChartRodStackItem(
                            0, bar.y, AppColor.statsEnergyConsumption),
                        // Target Consumption
                        BarChartRodStackItem(
                            0, bar.targetY, AppColor.statsEnergyTarget)
                      ],
                      borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(5),
                          topRight: Radius.circular(5)),
                      width: 15),
                ]))
            .toList()));
  }
}
