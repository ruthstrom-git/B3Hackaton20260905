const MODE_COLORS = {
  Bright: '#D9A441',
  Content: '#8AA05C',
  Calm: '#5C84A6',
  Tired: '#6B6483',
  Tense: '#B5533C',
};
const MODE_ORDER = ['Bright', 'Content', 'Calm', 'Tired', 'Tense'];
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const BUCKET_LABELS = ['MORNING', 'MIDDAY', 'EVENING', 'NIGHT'];

function weekdayIndex(date) {
  return (date.getDay() + 6) % 7; // Mon=0 ... Sun=6
}

function bucketIndex(date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 0; // Morning
  if (hour >= 12 && hour < 17) return 1; // Midday
  if (hour >= 17 && hour < 21) return 2; // Evening
  return 3; // Night (21:00-04:59, wraps past midnight)
}

function currentWeekRange(now) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - weekdayIndex(now));
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start, end };
}

function buildGrid(conversations) {
  const { start, end } = currentWeekRange(new Date());
  const inWeek = conversations.filter((c) => {
    const created = new Date(c.created);
    return created >= start && created < end;
  });

  const grid = Array.from({ length: 4 }, () => Array.from({ length: 7 }, () => []));
  for (const conversation of inWeek) {
    const created = new Date(conversation.created);
    const day = weekdayIndex(created);
    const bucket = bucketIndex(created);
    grid[bucket][day].push(conversation);
  }
  for (const row of grid) {
    for (const cell of row) {
      cell.sort((a, b) => new Date(a.created) - new Date(b.created));
    }
  }

  return { grid, count: inWeek.length };
}

function renderGrid(grid) {
  const container = document.getElementById('week-grid');
  container.innerHTML = '';

  container.appendChild(document.createElement('div'));
  for (const label of DAY_LABELS) {
    const header = document.createElement('div');
    header.className = 'day-header';
    header.textContent = label;
    container.appendChild(header);
  }

  BUCKET_LABELS.forEach((label, bucketIdx) => {
    const rowLabel = document.createElement('div');
    rowLabel.className = 'bucket-label';
    rowLabel.textContent = label;
    container.appendChild(rowLabel);

    for (let day = 0; day < 7; day++) {
      const conversations = grid[bucketIdx][day];
      const cell = document.createElement('div');
      cell.className = 'week-cell';
      if (conversations.length === 0) {
        cell.classList.add('empty');
      } else {
        for (const conversation of conversations) {
          const stripe = document.createElement('div');
          stripe.className = 'stripe';
          stripe.style.background = MODE_COLORS[conversation.mode];
          stripe.title = `${conversation.mode} — ${new Date(conversation.created).toLocaleString()}`;
          cell.appendChild(stripe);
        }
      }
      container.appendChild(cell);
    }
  });
}

function renderLegend() {
  const legend = document.getElementById('legend');
  legend.innerHTML = '';
  for (const mode of MODE_ORDER) {
    const item = document.createElement('div');
    item.className = 'legend-item';
    const swatch = document.createElement('span');
    swatch.className = 'legend-swatch';
    swatch.style.background = MODE_COLORS[mode];
    const label = document.createElement('span');
    label.textContent = mode;
    item.append(swatch, label);
    legend.appendChild(item);
  }
}

async function loadSummary() {
  const res = await fetch('/api/conversations');
  const conversations = await res.json();
  const { grid, count } = buildGrid(conversations);
  document.getElementById('log-count').textContent = `${count} LOGS`;
  renderGrid(grid);
  renderLegend();
}

loadSummary();
