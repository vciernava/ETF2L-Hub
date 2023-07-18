export default class Commands {
    public static commands: any = [];


    public addCommand(command) {
        Commands.commands.push(command);
    }

    public getCommands(): any {
        return Commands.commands;
    }
}