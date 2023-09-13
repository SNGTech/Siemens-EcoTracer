import 'package:ecotracer/charts/timing_distribution/td_bar.dart';
import 'package:ecotracer/constants/colours.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

class CO2LineData {

  SideTitles getTicks() => SideTitles(
          showTitles: true,
          reservedSize: 40,
          getTitlesWidget: (value, meta) => Container(
            margin: const EdgeInsets.only(right: 10),
            child: Text(
              value.toInt().toString(),
              textAlign: TextAlign.right,
              style: const TextStyle(
                  color: Color(0xFFA3A8AF),
                  fontSize: 15,
                  fontWeight: FontWeight.w500),
            ),
          ),
        );
}