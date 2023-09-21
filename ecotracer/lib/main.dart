import "dart:async";

import "package:ecotracer/ecotrace_co2_tracker.dart";
import "package:ecotracer/ecotrace_connecting.dart";
import "package:ecotracer/ecotrace_home.dart";
import 'package:ecotracer/ecotrace_monitor.dart';
import "package:ecotracer/ecotrace_options.dart";
import "package:ecotracer/ecotrace_setup.dart";
import "package:ecotracer/models/requests.dart";
import "package:flutter/material.dart";
import 'package:go_router/go_router.dart';

// Intitialise all possible routes

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final router =
    GoRouter(initialLocation: '/', navigatorKey: _rootNavigatorKey, routes: [
  ShellRoute(
    navigatorKey: _shellNavigatorKey,
    routes: [
      GoRoute(path: "/", builder: (context, state) => EcoTracerHomePage()),
      GoRoute(
          path: "/options",
          builder: (context, state) => const EcoTracerOptionsPage(),
          routes: [
            GoRoute(
                path: "co2tracker",
                builder: (context, state) => EcoTracerCO2TrackerPage()),
            GoRoute(
                path: "setup",
                builder: (context, state) => EcoTracerSetupPage()),
            GoRoute(
                path: "monitor",
                builder: (context, state) => EcoTracerMonitorPage()),
            GoRoute(
                path: "offset",
                builder: (context, state) => EcoTracerHomePage())
          ]
          //GoRoute(path: "/settings", builder: (context, state) => EcoTracerSettingsPage()),
          )
    ],
    builder: (context, state, child) => EcoTracerPage(child),
  )
]);

void main(List<String> args) {
  runApp(const EcoTracerApp());
}

class EcoTracerApp extends StatelessWidget {
  const EcoTracerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
        title: "EcoTracer",
        theme: ThemeData(fontFamily: "Roboto"),
        routerConfig: router);
  }
}

class EcoTracerPage extends StatefulWidget {
  final Widget child;

  const EcoTracerPage(this.child, {super.key});

  @override
  State<StatefulWidget> createState() => EcoTracerState();
}

class EcoTracerState extends State<EcoTracerPage> {
  int currentPageIndex = 0;

  Timer? connectingTimer;
  bool isConnected = false;
  bool isStillConnected = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
    if(connectingTimer != null) connectingTimer!.cancel();
  }

  @override
  Widget build(BuildContext context) {
    return isConnected ? 
    Scaffold(
        bottomNavigationBar: NavigationBar(
          indicatorColor: const Color.fromARGB(255, 185, 223, 201),
          destinations: const [
            NavigationDestination(icon: Icon(Icons.home_filled), label: "Home"),
            NavigationDestination(
              icon: Icon(Icons.precision_manufacturing_rounded),
              label: "Track",
            ),
            NavigationDestination(icon: Icon(Icons.settings), label: "Settings")
          ],
          // Set the selected page index to switch to next page
          selectedIndex: currentPageIndex,
          onDestinationSelected: (int index) => {
            setState(() {
              currentPageIndex = index;

              switch (currentPageIndex) {
                case 0:
                  context.go("/");
                  break;
                case 1:
                  context.go("/options");
                  break;
                case 2:
                  context.go("/settings");
                  break;
              }
            })
          },
        ),
        body: widget.child) :
        ConnectingPage((String ipAddress) {
          if(connectingTimer != null) connectingTimer!.cancel();
          connectingTimer = Timer.periodic(const Duration(seconds: 5), (timer) async {
            isConnected = await getServerStatus(ipAddress);
            if(!isConnected && isStillConnected) {
              setState(() {});
              isStillConnected = false;
            }
            if(isConnected && !isStillConnected) {
              setState(() {});
              isStillConnected = true;
            }
          });
        });
  }
}
