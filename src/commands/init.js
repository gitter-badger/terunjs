import fs from 'fs';

async function init() {
	let content = await fs.readFileSync(__dirname + '/../resource/config.json', 'utf-8');
	await fs.writeFileSync(`${process.cwd()}/terun.default.json`, content);
}

export default init;