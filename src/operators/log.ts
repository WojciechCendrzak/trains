import { tap } from 'rxjs';

export const log = (name: string) => tap((val: any) => console.log(`log - ${name}`, val));
