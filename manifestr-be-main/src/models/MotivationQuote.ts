import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('motivation_quotes')
export class MotivationQuote {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    text!: string;

    @CreateDateColumn()
    created_at!: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    last_shown_at!: Date;
}
