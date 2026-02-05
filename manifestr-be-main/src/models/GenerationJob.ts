import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

export enum GenerationStatus {
    QUEUED = "QUEUED",
    PROCESSING_INTENT = "PROCESSING_INTENT",
    PROCESSING_LAYOUT = "PROCESSING_LAYOUT",
    PROCESSING_CONTENT = "PROCESSING_CONTENT",
    CRITIQUING = "CRITIQUING",
    RENDERING = "RENDERING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

export enum GenerationType {
    PRESENTATION = "presentation",
    DOCUMENT = "document",
    SPREADSHEET = "spreadsheet",
}

@Entity("generation_jobs")
export class GenerationJob {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    prompt: string;


    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    cover_image: string;


    @Column({ type: "jsonb", nullable: true })
    meta: any;

    @Column({
        type: "enum",
        enum: GenerationType,
        nullable: true
    })
    output_type: GenerationType;

    @Column({
        type: "enum",
        enum: GenerationStatus,
        default: GenerationStatus.QUEUED
    })
    status: GenerationStatus;

    @Column({ type: "jsonb", nullable: true })
    current_step_data: any; // Stores the output of the latest completed Agent

    @Column({ nullable: true })
    final_url: string; // S3 Link to the JSON or exported file

    @Column({ type: "int", default: 0 })
    tokens_used: number;

    @Column({ type: "text", nullable: true })
    error_message: string;

    // Relations
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
