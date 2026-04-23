import { useState } from "react";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Toaster } from "@/components/ui/toaster";
import EconLab from "@/pages/EconLab";

function App() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={EconLab} />
        <Route component={EconLab} />
      </Switch>
      <Toaster />
    </Router>
  );
}

export default App;
