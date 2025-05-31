@@ .. @@
 import React from 'react';
 import { useGame } from '../context/GameContext';
 import Character from './Character';
 import HealthBar from './HealthBar';
 import Timer from './Timer';
 import QuestionBox from './QuestionBox';
 import AttackDisplay from './AttackDisplay';
+import pokemonLogo from '../assets/pokemon-logo.png';
 
 const Game: React.FC = () => {
   const { 
   }
 }
@@ .. @@
     switch (gameState.gameStatus) {
       case 'not-started':
         return (
         )
     }
-          <div className="text-center">
-            <h1 className="text-3xl font-bold mb-4">Question Battle</h1>
+          <div className="text-center space-y-6">
+            <img src={pokemonLogo} alt="Pokemon" className="h-24 mx-auto" />
             <p className="mb-6">Answer questions quickly to attack your opponent!</p>
             <button 
               onClick={startGame}
@@ .. @@
       case 'player-won':
         return (
           <div className="text-center">
-            <h1 className="text-3xl font-bold mb-4 text-green-600">Victory!</h1>
+            <img src={pokemonLogo} alt="Pokemon" className="h-24 mx-auto mb-4" />
+            <h2 className="text-3xl font-bold mb-4 text-green-600">Victory!</h2>
             <p className="mb-6">You defeated the computer with your knowledge!</p>
             <button 
               onClick={resetGame}
@@ .. @@
       case 'computer-won':
         return (
           <div className="text-center">
-            <h1 className="text-3xl font-bold mb-4 text-red-600">Defeat!</h1>
+            <img src={pokemonLogo} alt="Pokemon" className="h-24 mx-auto mb-4" />
+            <h2 className="text-3xl font-bold mb-4 text-red-600">Defeat!</h2>
             <p className="mb-6">The computer has defeated you!</p>
             <button 
               onClick={resetGame}