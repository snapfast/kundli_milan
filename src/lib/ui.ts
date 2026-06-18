export function generateMatchCardHtml(name: string, category: string, score: number, description: string, kootaHtml: string): string {
    return `
        <div class="match-header">
            <span class="match-name">${name}</span>
            <span class="match-category">${category}</span>
        </div>
        <div class="match-score">${score} / 36</div>
        ${description ? `<div class="match-description">${description}</div>` : ''}
        ${kootaHtml}
    `;
}
