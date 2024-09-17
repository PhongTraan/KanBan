package com.api.dto;

import com.api.entity.From;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MoveTask {
    private String taskId;
//    private int startPosition;
    private int overPosition;
//    private From startStatus;
    private From overStatus;
}
