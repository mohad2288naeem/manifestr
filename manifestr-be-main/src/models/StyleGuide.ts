import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("style_guides")
export class StyleGuide {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ type: "jsonb", nullable: true })
    logo: {
        primary?: string;
        usage?: string;
    };

    @Column({ type: "jsonb", nullable: true })
    typography: {
        headings?: { font: string; weight: string };
        body?: { font: string; weight: string };
    };

    @Column({ type: "jsonb", nullable: true })
    colors: {
        primary?: string[];
        secondary?: string[];
        backgrounds?: string[];
    };

    @Column({ type: "jsonb", nullable: true })
    style: {
        tone?: string[];
        audience?: string[];
        personality?: string;
        phrases?: { weSay: string; weDontSay: string }[];
        personas?: { title: string; summary: string }[];
    };

    @Column({ type: "boolean", default: false })
    is_completed: boolean;

    @Column({ type: "int", default: 1 })
    current_step: number;

    @Column({ nullable: true })
    thumbnail_url: string;

    // Ownership
    @Column({ type: "int" })
    userId: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "userId" })
    user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
