import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RefreshToken } from './RefreshToken';
export enum UserTier {
    FREE = 'free',
    PRO = 'pro',
    ENTERPRISE = 'enterprise'
}

@Entity('users')
export class User {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    id!: string; // Supabase UUID

    @Column({ type: 'varchar', length: 255 })
    first_name!: string;

    @Column({ type: 'varchar', length: 255 })
    last_name!: string;

    @Column({ type: 'date', nullable: true })
    dob!: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    country!: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    gender!: string;

    @Column({ type: 'boolean', default: false })
    promotional_emails!: boolean;

    @Column({ type: 'boolean', default: false })
    onboarding_completed!: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    expertise!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    job_title!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    industry!: string;

    @Column({ type: 'text', nullable: true })
    goal!: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    work_style!: string;

    @Column({ type: 'text', nullable: true })
    problems!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password_hash!: string; // Made nullable since we're using Supabase Auth

    @Column({ type: 'boolean', default: false })
    email_verified!: boolean;

    @Column({ type: 'enum', enum: UserTier, default: UserTier.FREE })
    tier!: UserTier;

    @Column({ type: 'int', default: 0 })
    wins_balance!: number;

    @OneToMany(() => RefreshToken, token => token.user)
    refresh_tokens!: RefreshToken[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
