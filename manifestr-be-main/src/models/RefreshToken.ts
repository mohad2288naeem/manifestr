import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    user_id!: number;

    @Column({ type: 'varchar', length: 500 })
    token!: string;

    @Column()
    expires_at!: Date;

    @Column({ default: false })
    revoked!: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    device_name!: string;

    @Column({ type: 'varchar', length: 45, nullable: true })
    ip_address!: string;

    @Column({ type: 'text', nullable: true })
    user_agent!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    last_active!: Date;

    @ManyToOne(() => User, user => user.refresh_tokens, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @CreateDateColumn()
    created_at!: Date;
}
