import React, { useState, ChangeEvent, MouseEvent } from 'react';
import './App.css';

// Définir le type pour les tâches
interface Task {
  text: string;
  priority: 'Low' | 'Medium' | 'High';
}

// Définir l'ordre des priorités
const priorityOrder: { [key: string]: number } = {
  'Low': 1,
  'Medium': 2,
  'High': 3,
};

export default function App() {
  // Initialisation du tableau task avec sa fonction de mise à jour
  const [task, setTask] = useState<Task[]>([]);
  // Initialisation de la priorité avec sa fonction de mise à jour
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  // Variable pour stocker la valeur actuelle de l'input
  const [currentTask, setCurrentTask] = useState<string>('');
  // Variable pour la recherche par mot-clé
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  // Variable pour le tri
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  // Variable pour la sélection de priorité (affichage de toutes les tâches ou filtrage par priorité)
  const [showAll, setShowAll] = useState<boolean>(true);

  // Limite de caractères pour l'input
  const maxLength = 25; // Limite de 25 caractères

  // Fonction qui va gérer les valeurs des inputs
  function handleInput(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.value.length <= maxLength) {
      setCurrentTask(event.target.value);
    }
  }

  // Fonction qui va ajouter la tâche courante à la liste des tâches
  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    setTask([...task, { text: currentTask, priority }]);
    setCurrentTask('');
  }

  // Fonction pour supprimer une tâche par index
  function deleteTask(index: number): void {
    const updatedTasks = task.filter((_, idx) => idx !== index);
    setTask(updatedTasks);
  }

  // Fonction pour mettre à jour la priorité
  function handlePriority(event: ChangeEvent<HTMLSelectElement>): void {
    setPriority(event.target.value as 'Low' | 'Medium' | 'High');
    setShowAll(false); // Filtrer par priorité spécifique
  }

  // Fonction pour mettre à jour le mot-clé de recherche
  function handleSearch(event: ChangeEvent<HTMLInputElement>): void {
    setSearchKeyword(event.target.value);
  }

  // Fonction pour mettre à jour l'ordre de tri
  function handleSortOrder(event: ChangeEvent<HTMLSelectElement>): void {
    setSortOrder(event.target.value as 'ASC' | 'DESC');
  }

  // Fonction pour afficher toutes les tâches
  function handleShowAll(): void {
    setShowAll(true);
    setPriority('Low'); // Réinitialiser la priorité à 'Low' lors de l'affichage de toutes les tâches
  }

  // Filtrer et trier les tâches
  const filteredTasks = task
    .filter(t => t.text.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      (showAll || t.priority === priority))
    .sort((a, b) => {
      if (sortOrder === 'ASC') {
        // Tri par priorité et ensuite par texte
        return priorityOrder[a.priority] - priorityOrder[b.priority] || a.text.localeCompare(b.text);
      } else {
        // Tri par priorité et ensuite par texte, mais en ordre décroissant
        return priorityOrder[b.priority] - priorityOrder[a.priority] || b.text.localeCompare(a.text);
      }
    });

  // Affichage du résultat
  return (
    <div className="container">
      <h1>Task:</h1>
      <input
        className="inputPlace"
        value={currentTask}
        onChange={handleInput}
        maxLength={maxLength} // Limite de caractères
      />
      <div className="buttonContainer">
        <button
          className="putButton"
          onClick={handleClick}
        >
          Add task
        </button>
        <details>
          <summary>Priority</summary>
          <select onChange={handlePriority}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </details>
        <button
          onClick={handleShowAll}
          className="putButton"
        >
          Show All Task
        </button>
      </div>

      <div className="taskContainer">
        <h1>Task list:</h1>
        <div>
          <label>Search by keyword </label>
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearch}
            className="inputPlace"
          />
        </div>
        <div>
          <select onChange={handleSortOrder}>
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
        <ul>
          {filteredTasks.map((item, index) => (
            <div className={`listDisplay priority-${item.priority.toLowerCase()}`} key={index}>
              {item.text}
              <button
                className="deleteButton"
                onClick={() => deleteTask(index)}
              >
                delete
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
