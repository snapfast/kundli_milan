import { fetchUsers } from '../src/lib/api';
async function main() {
    try {
        const users = await fetchUsers();
        console.log(JSON.stringify(users, null, 2));
    } catch (e) {
        console.error(e);
    }
}
main();
