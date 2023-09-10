import 'package:ecotracer/charts/timing_distribution/td_bar.dart';
import 'package:ecotracer/constants/colours.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'dart:math' as math;

class TDBarChartData {
  final double percentWork;
  final double percentIdle;
  final double percentDowntime;

  final double interval = 10.0;

  TDBarChartData(
      {required this.percentWork,
      required this.percentIdle,
      required this.percentDowntime});

  List<TDBar> barData = [];

  void init() {
    barData = [
      TDBar(x: 0, y: percentWork, label: "Work", colour: AppColor.darkTeal),
      TDBar(x: 1, y: percentIdle, label: "Idle", colour: AppColor.statsYellow),
      TDBar(
          x: 2,
          y: percentDowntime,
          label: "Downtime",
          colour: AppColor.statsRed)
    ];
  }

  SideTitles getLabels() => SideTitles(
      showTitles: true,
      reservedSize: 75,
      getTitlesWidget: (id, meta) => RotatedBox(
            quarterTurns: 3,
            child: Container(
              margin: const EdgeInsets.only(right: 5),
              alignment: Alignment.topRight,
              child: Text(
                barData.firstWhere((e) => e.x == id.toInt()).label,
                textAlign: TextAlign.center,
                style: const TextStyle(
                    color: AppColor.dark,
                    fontSize: 15,
                    fontWeight: FontWeight.w500),
              ),
            ),
          ));

  SideTitles getTicks() => SideTitles(
        showTitles: true,
        reservedSize: 30,
        getTitlesWidget: (value, meta) => RotatedBox(
          quarterTurns: 3,
          child: Container(
            margin: const EdgeInsets.only(top: 5),
            child: Text(
              value % interval == 0 ? value.toInt().toString() : "",
              textAlign: TextAlign.center,
              style: const TextStyle(
                  color: Color(0xFFA3A8AF),
                  fontSize: 15,
                  fontWeight: FontWeight.w500),
            ),
          ),
        ),
      );
}
