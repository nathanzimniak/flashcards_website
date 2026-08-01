# Memento

Une interface de gestion de flashcards élégante et responsive, conçue en HTML, CSS et JavaScript natifs.

## Lancer le projet

```bash
python3 -m http.server 8000
```

Ouvrez ensuite `http://localhost:8000` dans votre navigateur.

## Répétition espacée

Une session contient uniquement les cartes arrivées à échéance. Après chaque
réponse, les trois évaluations planifient la prochaine révision :

- **Difficile** : dans 10 minutes ;
- **Moyen** : dans 1 jour, puis l'intervalle est doublé ;
- **Facile** : dans 4 jours, puis l'intervalle est triplé.

Les nouvelles cartes, qui n'ont pas encore d'échéance, sont disponibles
immédiatement.
