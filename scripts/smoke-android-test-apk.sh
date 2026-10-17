#!/usr/bin/env bash
# Colloquio locale con un emulatore nuovo; nessun account o servizio remoto.
set -euo pipefail
mkdir -p test-smoke
printf 'Compiled: yes (downloaded artifact verified)\nInstalled: not yet\nStarted: not yet\nAuthenticated services: not tested\n' > test-smoke/STATUS.txt
adb shell svc wifi disable
adb shell svc data disable
adb install test-apk/Calistenia-TEST-standalone.apk > test-smoke/install.txt
printf 'Installed: yes\n' >> test-smoke/STATUS.txt
adb logcat -c
adb shell am start -W -n tech.guille.calistenia/.MainActivity > test-smoke/launch.txt
# Non basta che il processo esista: aspettare il testo React della schermata login.
for attempt in $(seq 1 60); do
  adb shell uiautomator dump /sdcard/test-window.xml >/dev/null 2>&1 || true
  adb pull /sdcard/test-window.xml test-smoke/window.xml >/dev/null 2>&1 || true
  if grep -q 'text="CALISTENIA"' test-smoke/window.xml 2>/dev/null; then
    adb shell pidof tech.guille.calistenia > test-smoke/pid.txt
    adb exec-out screencap -p > test-smoke/login.png
    printf 'Started: yes (React login UI rendered, no Metro)\nRemote network: disabled before launch\nFunctional/authenticated testing: not performed\n' >> test-smoke/STATUS.txt
    exit 0
  fi
  sleep 3
done
adb logcat -d -s AndroidRuntime ReactNativeJS > test-smoke/startup-errors.txt
adb exec-out screencap -p > test-smoke/startup-failed.png
printf 'Started: failed (React login marker not rendered)\n' >> test-smoke/STATUS.txt
exit 1
