# Graph Hierarchy client

Next.js front end for the [Graph Hierarchy API](https://github.com/arav7781/aravsaxena-bfhl).
Live: **[iskcon-voice.vercel.app](https://iskcon-voice.vercel.app)**

Type or paste edges like `A->B`, send them to the API, and see:

- the trees built from each connected group of nodes, rendered as nested lists;
- which groups contain a cycle;
- invalid or duplicate entries, with the reason they were rejected;
- summary cards (number of trees, cycles, the largest tree's root).

## Run

```bash
npm install
NEXT_PUBLIC_API_URL=http://localhost:3000 npm run dev    # defaults to the hosted API on Render
```

`lib/api.js` holds the single `processGraph(edges)` call to `POST /api/graph`.

## Tech

Next.js · React · CSS Modules · Tailwind CSS
