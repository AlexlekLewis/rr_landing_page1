on run argv
    set inputFile to item 1 of argv
    set outputFile to item 2 of argv
    
    tell application "Microsoft Word"
        set doc to open file name inputFile
        save as doc file name outputFile file format format PDF
        close doc
    end tell
end run
